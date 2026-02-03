import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// ============================================
// ADMIN GUARD
// Checks if the authenticated user has admin privileges
// ============================================

@Injectable()
export class AdminGuard implements CanActivate {
  // List of admin wallet addresses
  // TODO: Move this to environment variables or database
  private readonly ADMIN_WALLETS: string[] = [
    'Fqx7NaJm7KF2n8kkC2zNbJDYAH2qrrkk2QCJRuYR1utQ', 
   // Add your admin wallet addresses here
    // Example: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  ];

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is authenticated (JWT passed)
    if (!user || !user.walletAddress) {
      throw new ForbiddenException('Authentication required');
    }

    // Check if user's wallet is in admin list
    const isAdmin = this.ADMIN_WALLETS.includes(user.walletAddress);

    if (!isAdmin) {
      throw new ForbiddenException(
        'Admin privileges required to perform this action'
      );
    }

    return true;
  }
}
