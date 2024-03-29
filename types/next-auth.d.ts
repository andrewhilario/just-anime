import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    token: string;
    account_type: string | null;
    is_staff: boolean;
  }

  interface Session extends DefaultSession {
    user: User;
    token: string;
  }
}
