import { prisma } from "@repo/db/client"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import type { NextAuthOptions , User } from "next-auth";



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: {label: 'Phone Number', type: "text", placeholder: "+91 443035733"},
                userName: {label: 'Username', type: "text", placeholder:"John Deo"},
                password: {label: 'Password', type: "password"},
                email: {label: 'Email', type:"text", placeholder:"john@gmail.com"}
            },
            async authorize(credentials, req): Promise<User | null> {
                if(!credentials?.phone || !credentials.password){
                    return null;
                }
               const { phone , userName, password, email } = credentials;
               const existingUser = await prisma.user.findFirst({
                 where: {
                    PhoneNumber: phone
                 }
               });
               if(existingUser) {
                 const isValid = await bcrypt.compare(password, existingUser.password);
                 if(!isValid) return null;
                  return {
                        id: existingUser.id.toString(),
                        name: existingUser.userName,
                        email: existingUser.email,
                        
                    }
               }
               try {
                    const hashPassword = await bcrypt.hash(password, 10);
                   const newUser = await prisma.user.create({
                      data: {
                         PhoneNumber: phone,
                         password: hashPassword,
                         userName: userName,
                         email: email
                      }
                   })
                   return {
                      id: newUser.id.toString(),
                      name: newUser.userName,
                      email: newUser.email
                   }
               } catch (error) {
                  console.error(error);
                  return null;
               }
            
            },
            
            
        })
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async jwt({token ,user}) {
            if(user){
                token.sub = user.id
            }
            return token
        },
        async session({ token, session } : any) {
            if(session.user && token.sub){
                session.user.id = token.sub
            }
            return session;
        }
    }
}
