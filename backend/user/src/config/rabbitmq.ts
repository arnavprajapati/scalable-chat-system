import ampq from 'amqplib';

let channel: ampq.Channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await ampq.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: 5672,
            username: process.env.RABBITMQ_USERNAME || 'guest',
            password: process.env.RABBITMQ_PASSWORD || 'guest',
        });
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ successfully');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
};