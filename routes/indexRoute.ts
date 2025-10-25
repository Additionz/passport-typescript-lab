import express from "express";
const router = express.Router();
import { ensureAuthenticated, ensureAdmin } from "../middleware/checkAuth";
import { off } from "process";
import { session } from "passport";

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  if (req.user?.role == 'user') {
    res.render("dashboard", {
      user: req.user,
      admin: '<p></p>'
    });
  } else {
    res.render("dashboard", {
      user: req.user,
      admin: '<a class="btn btn-secondary" href="/admin" >Go to Admin dashboard</a>'
    })
  }
});

router.get("/admin", ensureAdmin, (req, res) => {
  let userSessions: { sessionId: string, userId: string | number }[] = []  
  if (req.sessionStore?.all) {
    req.sessionStore.all((err, sessions) => {
      if (err) console.log(err)
      for (const [key, value] of Object.entries(sessions)) {
        userSessions.push({ sessionId: key, userId: value.passport?.user})
      }
    res.render("admin", {
    user: req.user,
    sessions: userSessions
    })
  })
}});

router.post("/admin/revoke/:sessionId", ensureAdmin, (req, res) => {
  let revokeSession = req.params.sessionId;
  if (revokeSession == req.sessionID) {
    req.sessionStore.destroy(revokeSession, (err) => {
    if (err) console.log(err)
      res.redirect("/auth/login")
  })} 
  else {
    req.sessionStore.destroy(revokeSession, (err) => {
    if (err) console.log(err)
      res.redirect("/admin")
  })}
});

export default router;
