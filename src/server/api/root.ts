import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc"
import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { sessionRouter } from "./routers/session";
import { sectionRouter } from "./routers/section";
import { companyRouter } from "./routers/company";
import { contactRouter } from "./routers/contact";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    post: postRouter,
    user: userRouter,
    session: sessionRouter,
    section: sectionRouter,
    company: companyRouter,
    contact: contactRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
