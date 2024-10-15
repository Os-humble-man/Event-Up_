const http = require("http");
const config = require("./config");
const jsonwebtoken = require("jsonwebtoken");
const { Server, Socket } = require("socket.io");
const { logger } = require("./Logger");
const AuthRepository = require("../repository/AuthRepository");

class SocketServer {
    static instance;
    io;

    constructor(server) {
        this.io = new Server(server);
        this.authMiddleware();
        this.setupSocketEvents();
    }

    authMiddleware() {
        this.io.use(async (socket, next) => {
            try {
                const accessToken = socket.handshake.auth.token.split(' ')[1];
                const credentials = await AuthRepository.verify(accessToken)
                if (!credentials) {
                    logger.error(`Socket Auth Error: Empty credentials`);
                    return;
                }
                socket.request.auth = credentials;
                return next();
            } catch (error) {
                logger.error(`Socket Auth Error: ${error}`);
                return new Error("It seems we are not able to authenticate you!");
            }
        });
    }

    setupSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("Socket Client Connected!");

            // Join the relevant room based on user type and order when a user connects
            const userId = socket.request.auth.id;
            const userType = socket.request.auth.roleId;




            if (userType === 1) {
                // const customerPhoneNumber = socket.request.auth.phone;
                const adminRoom = `adminRoom_${userId}`;
                // console.log("adminRoom", adminRoom);
                socket.join("adminRoom", adminRoom);
            } else if (userType === 2) {
                const userRoom = `userRoom_${userId}`;
                socket.join("userRoom", userRoom);
            } else if (userType === 3) {
                const superUserRoom = `superUserRoom_${userId}`;
                socket.join("superUserRoom", superUserRoom);
            } else if (userType === 4) {
                const supportRoom = `supportRoom_${userId}`;
                socket.join("supportRoom", supportRoom);

            }

            socket.on("disconnect", () => logger.info("Socket Client Disconnected!"));
            socket.on("new-ticket", (ticket) => {
                logger.info(`New Ticket created: ${ticket}`)
                socket.to("adminRoom").emit("new-ticket", ticket);
            });
            socket.on("seen-request", (ticket) => {

                const ticketCreatedBy = ticket.ticket_created_by
                const connectedSockets = SocketServer.io.sockets.adapter.rooms.get(`userRoom_${ticketCreatedBy}`);

                logger.info(`Request seen: ${connectedSockets}`)
            });
            socket.on("request-sent", (request) => {
                logger.info(`Request sent: ${request}`)
                socket.to("adminRoom").emit("request-sent", request);
            });
            socket.on("request-accepted", (request) => {
                logger.info(`Request accepted: ${request}`)
                socket.broadcast.to("adminRoom").emit("request-accepted", request);
            });

            socket.on("assigned-request", (request) => logger.info(`Request assigned: ${request}`));
            socket.on("closed-request", (request) => logger.info(`Request closed: ${request}`));
            socket.on("cancelled-request", (request) => logger.info(`Request cancelled: ${request}`));
            socket.on("send-reminder", (request) => logger.info(`Reminder sent: ${request}`));
        });
    }

    getIO() {
        return this.io;
    }

    static async init(server) {
        if (!SocketServer.instance) {
            SocketServer.instance = new SocketServer(server);
        }
        // const pub = createClient(); // Await the creation of the Redis client
        // const sub = pub.duplicate(); // Duplicate the client for subscriptions
        // await pub.connect();
        // await sub.connect();
        // SocketServer.instance.io.adapter(createAdapter(pub, sub));
        logger.info("Socket Server with (Pub/Sub) Ready...");
    }

    static get() {
        if (!SocketServer.instance) {
            throw new Error("Socket Server has not been initialized.");
        }
        return SocketServer.instance.getIO();
    }

    static io() {
        return SocketServer.instance.getIO();
    }
}

module.exports = SocketServer;
