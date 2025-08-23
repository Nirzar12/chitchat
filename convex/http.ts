// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { WebhookEvent } from "@clerk/nextjs/server";


// import { internal } from "./_generated/api";

// const http = httpRouter();

// const validatePayload = async (
//   req: Request
// ): Promise<WebhookEvent | undefined> => {
//   const payload = await req.text();
//   const svixheaders = {
//     "svix-id": req.headers.get("svix-id")!,
//     "svix-timestamp": req.headers.get("svix-timestamp")!,
//     "svix-signature": req.headers.get("svix-signature")!,
//   };

//   const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
//   try {
//     const event = webhook.verify(payload, svixheaders) as WebhookEvent;
//     return event;
//   } catch (error) {
//     console.error("Clerk Webhook signature verification failed:", error);
//     return;
//   }
// };

// const handleClerkWebhook = httpAction(async (ctx, req) => {
//   const event = await validatePayload(req);
//   if (!event) {
//     return new Response("Could not validate Clerk payload", { status: 400 });
//   }

//   switch (event.type) {
//     case "user.created": {
//       const user = await ctx.runQuery(internal.user.get, { clerkId: event.data.id });
//       if (user) {
//         console.log(
//           `Updating existing user with clerkId: ${event.data.id} with:`,
//           event.data
//         );
//       }
//       break; // <-- missing break
//     }
//     case "user.updated": {
//       console.log(`Creating/Updating user:`, event.data.id);
//       await ctx.runMutation(internal.user.create, {
//         username: `${event.data.first_name} ${event.data.last_name}`, // fixed template literal
//         imageUrl: event.data.image_url, // correct field name from Clerk event
//         clerkId: event.data.id,
//         email: event.data.email_addresses[0].email_address,
//       });
//       break;
//     }
//     default: {
//       console.log("Clerk Event not supported:", event.type);
//       break;
//     }
//   }

//   return new Response(null, { status: 200 });
// });

// http.route({
//   path: "/clerk-users-webhook",
//   method: "POST",
//   handler: handleClerkWebhook,
// });

// export default http;

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix"; // 
import type { WebhookEvent } from "@clerk/backend"; // correct types
import { internal } from "./_generated/api";

const http = httpRouter();

// Validate Clerk webhook signature
const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    console.log("Clerk webhook verified:", event.type);
    return event;
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return;
  }
};

// Handle webhook events
const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);
  if (!event) {
    return new Response("Invalid Clerk webhook payload", { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created": {
        // Check if user already exists
        const existingUser = await ctx.runQuery(internal.user.get, {
          clerkId: event.data.id,
        });

        if (!existingUser) {
          // console.log("Creating new user in Convex:", event.data);
          await ctx.runMutation(internal.user.create, {
            username: `${event.data.first_name} ${event.data.last_name}`,
            imageUrl: event.data.image_url,
            clerkId: event.data.id,
            email: event.data.email_addresses[0].email_address,
          });
        } else {
          console.log("User already exists in Convex:", existingUser);
        }
        break;
      }

      case "user.updated": {
        console.log("User updated event received:", event.data.id);
        // Optional: You can update user info here if needed
        break;
      }

      default:
        console.log("Clerk event not supported:", event.type);
        break;
    }
  } catch (err) {
    console.error("Error processing webhook:", err);
  }

  return new Response(null, { status: 200 });
});

// Expose route
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
