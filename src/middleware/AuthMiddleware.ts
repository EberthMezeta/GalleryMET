import express, { NextFunction, Request, Response } from "express";

export function middleware(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    next();
    return;
  }
  res.redirect("/login");
}

export function middlewareHome(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    res.redirect("/home");
    return;
  }
  next();
}
