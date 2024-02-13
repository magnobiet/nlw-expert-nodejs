import { ReactNode } from "react";

export function Container({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="container max-w-96">{children}</div>;
}
