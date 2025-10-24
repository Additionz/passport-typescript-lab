import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import { database } from '../../models/userModel'
const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },
    
    /* FIX ME 😭 */
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user?: Express.User | false | null) => void) => {
        try {
            let user = database.find((acc) => acc.id == parseInt(profile.id))
            if (!user) {
                const newUser = {
                    id: parseInt(profile.id),
                    name: profile.username? profile.username : profile.displayName,
                    email: "",
                    password: "",
                    role: "user",
                }
                database.push(newUser);
            }
            return done(null, user);
        } catch (err: any) {
            console.log(err);
            return done(null, false);
        }
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
