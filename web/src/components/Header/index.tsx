export function Header({ title }: Readonly<{ title: string }>) {
  return (
    <header className="py-8 border-b mb-8">
      <h1 className="text-3xl text-center font-bold">{title}</h1>
    </header>
  );
}
