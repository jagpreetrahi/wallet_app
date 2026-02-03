
import { Button } from './button';

interface AppBarProps {
    user : {
        name?: string |null
    } | null;
    onSignIn: () => void;
    onSignOut: () => void;
}

export const AppBar = ({user, onSignIn, onSignOut} : AppBarProps) => {
   return <div className='flex justify-between border-b px-4'>
    <div className='text-lg flex flex-col justify-center'>
        PayTm
    </div>
    <div className='flex flex-col justify-center pt-2'>
        <Button onClick={user? onSignOut : onSignIn}>{user? "LogOut": "LogIn"}</Button>

    </div>
   </div>
} 