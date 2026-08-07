import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/User.js";
import { normalizeUsername, validateUsername } from "../config/username.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  transformation: Record<string, unknown>[]
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, transformation } as any,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload to Cloudinary returned no result"));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};


export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const rateLimitKey = `otp:ratelimit:${email}`;
  const rateLimit = await redisClient.get(rateLimitKey);
  if (rateLimit) {
    res.status(429).json({
      message: "Too may requests. Please wait before requesting new opt",
    });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, {
    EX: 300,
  });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  const message = {
    to: email,
    subject: "Your otp code",
    body: `Your OTP is ${otp}. It is valid for 5 minutes`,
  };

  await publishToQueue("send-otp", message);

  res.status(200).json({
    message: "OTP sent to your mail",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp: enteredOtp } = req.body;

  if (!email || !enteredOtp) {
    res.status(400).json({
      message: "Email and OTP Required",
    });
    return;
  }

  const otpKey = `otp:${email}`;

  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp || storedOtp !== enteredOtp) {
    res.status(400).json({
      message: "Invalid or expired OTP",
    });
    return;
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

  if (!user) {
    const name = email.slice(0, 8);
    user = await User.create({ name, email });
  }

  const token = generateToken(user);

  res.json({
    message: "User Verified",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  res.json(user);
});

export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    res.status(404).json({
      message: "Please login",
    });
    return;
  }

  user.name = req.body.name;

  await user.save();

  const token = generateToken(user);

  res.json({
    message: "User Updated",
    user,
    token,
  });
});

export const updateAvatar = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    res.status(404).json({
      message: "Please login",
    });
    return;
  }

  if (!req.file) {
    res.status(400).json({
      message: "Image is required",
    });
    return;
  }

  // Drop the previous upload first so Cloudinary doesn't accumulate orphans.
  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  user.avatar = await uploadToCloudinary(req.file.buffer, "user-avatars", [
    { width: 400, height: 400, crop: "fill", gravity: "face" },
    { quality: "auto" },
  ]);

  await user.save();

  const token = generateToken(user);

  res.json({
    message: "Profile picture updated",
    user,
    token,
  });
});

export const checkUsername = TryCatch(async (req, res) => {
  const raw = req.query.username;

  if (typeof raw !== "string") {
    res.status(400).json({
      available: false,
      reason: "Username required",
    });
    return;
  }

  const { ok, reason } = validateUsername(raw);

  if (!ok) {
    res.json({ available: false, reason });
    return;
  }

  const existing = await User.findOne({ usernameLower: normalizeUsername(raw) });

  if (existing) {
    res.json({ available: false, reason: "Username already taken" });
    return;
  }

  res.json({ available: true });
});

export const setUsername = TryCatch(async (req: AuthenticatedRequest, res) => {
  const raw = req.body.username;

  if (typeof raw !== "string") {
    res.status(400).json({ message: "Username required" });
    return;
  }

  const { ok, reason } = validateUsername(raw);

  if (!ok) {
    res.status(400).json({ message: reason });
    return;
  }

  const username = raw.trim();
  const usernameLower = normalizeUsername(raw);

  try {
    // Conditional on the field being absent so a username can only ever be set once.
    const user = await User.findOneAndUpdate(
      { _id: req.user?._id, usernameLower: { $exists: false } },
      { $set: { username, usernameLower } },
      { new: true }
    );

    if (!user) {
      res.status(409).json({ message: "Username already set" });
      return;
    }

    res.json({
      message: "Username Updated",
      user,
      token: generateToken(user),
    });
  } catch (err: any) {
    // The unique index is what actually enforces uniqueness; the availability
    // check is only advisory. Translate the raw driver error into a clean message.
    if (err.code === 11000) {
      res.status(409).json({ message: "Username already taken" });
      return;
    }
    throw err;
  }
});

export const getAllUsers = TryCatch(async (req: AuthenticatedRequest, res) => {
  const users = await User.find();

  res.json(users);
});

export const getAUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.json(user);
});
