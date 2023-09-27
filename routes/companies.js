//Routes for companies
const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();

//GET  {companies: [{code, name}, ...]}

router.get("/", async function (req, res, next) {
  try {
    const result = await db.query(
      `SELECT code, name
        FROM companies
        ORDER BY name`
    );
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

//GET {company: {code, name, description}} add 404

router.get("/:code", async function (req, res, next) {
  try {
    let code = req.params.code;

    const compResult = await db.query(
      `SELECT code, name, description
            FROM companies
            WHERE code = $1`,
      [code]
    );
    if (compResult.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }

    const company = compResult.rows[0];

    return res.json({ company: company });
  } catch (err) {
    return next(err);
  }
});
