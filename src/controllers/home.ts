import { Request, Response, NextFunction } from "express";

export const index = (req: Request, res: Response) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    res.render("home", {
        title: "Login",
        user: req.session.userId
    });
};