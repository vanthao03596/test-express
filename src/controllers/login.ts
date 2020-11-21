import { Request, Response, NextFunction } from "express";
import { body, check, sanitize, validationResult } from "express-validator";

interface User {
    id: number,
    email: string,
    password: string
}
const mockUsers: User[] = [
    {
        id: 1,
        email: 'thao@123.com',
        password: '12312312'
    },
    {
        id: 2,
        email: 'hihi@gmail.com',
        password: '123213123'
    }

]
export const getLogin = (req: Request, res: Response) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("login", {
        title: "Login"
    });
};

export const postLogin = async (req: Request, res: Response) => {
    await check("email", "Email is not valid").isEmail().normalizeEmail({ gmail_remove_dots: false }).run(req);
    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("/login");
    }
    const user = mockUsers.find((u) => {
        return u.email == req.body.email && u.password == req.body.password;
    })

    if (!user) {
        req.flash("errors",{ msg: "Wrong email or password" });
        return res.redirect("/login");
    }

    req.session.userId = user.id

    req.flash("success", { msg: "Success! You are logged in." });
    
    res.redirect(req.session.returnTo || "/");

};