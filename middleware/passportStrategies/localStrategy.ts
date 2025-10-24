import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

const localStrategy = new LocalStrategy(
  {
    passReqToCallback: true,
    usernameField: "email",
    passwordField: "password",
  },
  (req, email, password, done) => {
    req.session.messages = [];
    try {
      const user = getUserByEmailIdAndPassword(email, password);
      return user
        ? done(null, user)
        : done(null, false, {
            message: "Your password is incorrect.",
          });
    } catch (e) {
      let email = req.body.email;
      done(null, false, {
        message: `Couldn't find the user with email: ${email}`,
      });
    }
  }
);

/*
FIX ME (types) 😭
*/
passport.serializeUser(function (user: Express.User, done: (err: any, id?: number) => void) {
  done(null, user.id);
});

/*
FIX ME (types) 😭
*/
passport.deserializeUser(function (id: number, done: (err: any, user?: Express.User | null) => void) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
