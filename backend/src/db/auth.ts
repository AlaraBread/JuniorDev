interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
}

interface Chat {
  users: string[];
}

interface Session {
  userId: string;
  token: string;
}

class AuthStore {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();

  createUser(username: string, password: string): User {
    if (
      Array.from(this.users.values()).some((user) => user.username === username)
    ) {
      throw new Error("Username already exists");
    }

    const id = crypto.randomUUID();
    const user: User = { id, username, password };
    this.users.set(id, user);
    return user;
  }

  validateCredentials(username: string, password: string): User {
    const user = Array.from(this.users.values()).find((u) =>
      u.username === username
    );
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }
    return user;
  }

  login(username: string, password: string): string {
    const user = this.validateCredentials(username, password);
    const token = crypto.randomUUID();
    this.sessions.set(token, { userId: user.id, token });
    return token;
  }

  logout(token: string): void {
    this.sessions.delete(token);
  }

  validateSession(token: string): User | null {
    const session = this.sessions.get(token);
    if (!session) return null;
    return this.users.get(session.userId) || null;
  }

  getAllUsers(): Array<Omit<User, "password">> {
    return Array.from(this.users.values()).map(({ id, username }) => ({
      id,
      username,
    }));
  }
}

export const authStore = new AuthStore();
