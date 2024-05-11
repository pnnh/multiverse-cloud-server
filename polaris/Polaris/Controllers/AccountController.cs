﻿using Microsoft.AspNetCore.Mvc;
using Polaris.Business.Models;

namespace Polaris.Controllers;

[ApiController]
public class AccountController(DatabaseContext databaseContext) : ControllerBase
{
    [Route("/account/session")]
    [HttpGet]
    public SessionModel? Session()
    {
        var claims = HttpContext.User;
        if (claims.Identity == null || string.IsNullOrEmpty(claims.Identity.Name))
            return null;

        var account = databaseContext.Accounts.FirstOrDefault(o => o.LoginSession == claims.Identity.Name);
        if (account == null)
            return null;

        var session = new SessionModel
        {
            Account = account,
            Token = claims.Identity.Name
        };

        return session;
    }
}