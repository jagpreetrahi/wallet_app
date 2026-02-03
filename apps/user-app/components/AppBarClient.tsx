"use client";
import { signIn, signOut, useSession} from "next-auth/react"
import { AppBar } from "@repo/ui/AppBar";
import { useRouter } from "next/navigation"

export function AppClient () {
    const session = useSession()
    const router = useRouter()

    return (
        <div>
            <AppBar onSignIn={signIn} onSignOut={async () => {
                await signOut()
                router.push("/api/auth/signin")
            }} user={session.data?.user ?? null}/>
        </div>
    )
}