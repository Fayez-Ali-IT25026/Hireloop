import { betterAuth } from "better-auth";
import { getOAuthState } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import { DEFAULT_ROLE, isRole } from "./roles";

const client = new MongoClient(process.env.MONGODB_URI as string );
const db = client.db('hireloop');

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  }, 

socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    user: {
       additionalFields: {
          role: {
               type: ["seeker", "recruiter", "admin"],
              required: false,
              defaultValue: DEFAULT_ROLE,
              input: true
            } 
        }
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // Email sign ups send `role` in the request body; OAuth sign ups
                    // (Google) carry it through the OAuth state. Anything else falls
                    // back to the default role.
                    const oauthRole = await getOAuthState()
                        .then((state) => state?.role)
                        .catch(() => undefined);

                    const role = isRole(user.role)
                        ? user.role
                        : isRole(oauthRole)
                            ? oauthRole
                            : DEFAULT_ROLE;

                    return { data: { ...user, role } };
                },
            },
        },
    },

  database: mongodbAdapter(db, {
    client,
  }),
});