import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { map, Observable, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants/services";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;

    if (!jwt) {
      return false;
    }

    // Check if the JWT is valid
    return this.authClient.send('authenticate', {
      Authentication: jwt
    }).pipe(
      tap((res) => {
        context.switchToHttp().getRequest().user = res;
      }),
      map(() => true)
    )
  }
}