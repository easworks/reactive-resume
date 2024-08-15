import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { ErrorMessage, processUsername } from "@reactive-resume/utils";
import { Profile, Strategy, AuthenticateOptions, DoneCallback } from "passport";

import { UserService } from "@/server/user/user.service";

@Injectable()
export class EasStrategy extends PassportStrategy(Strategy, "eas") {
  constructor(
    readonly clientID: string,
    readonly clientSecret: string,
    readonly callbackURL: string,
    private readonly userService: UserService,
  ) {
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ["email", "profile"],
    } as AuthenticateOptions);
  }

  async validate(_accessToken: string, _refreshToken: string, user: Profile, done: DoneCallback) {
    const { displayName, emails, photos, username } = user;
    // const email = emails?.[0].value ?? `${username}@google.com`;
    const picture = photos?.[0].value;

    let userT: User | null = null;

    if (!emails?.[0]) throw new BadRequestException();

    try {
      const userT =
        (await this.userService.findOneByIdentifier(emails[0].value)) ??
        (username && (await this.userService.findOneByIdentifier(username)));

      if (!userT) throw new Error("User not found.");

      done(null, userT);
    } catch {
      try {
        userT = await this.userService.create({
          email: emails[0].value,
          picture,
          locale: "en-US",
          name: displayName,
          provider: "eas",
          emailVerified: true, // auto-verify emails
          username: processUsername(username ?? emails[0].value.split("@")[0]),
          secrets: { create: {} },
        });
        done(null, userT);
      } catch {
        throw new BadRequestException(ErrorMessage.UserAlreadyExists);
      }
    }
  }
}
