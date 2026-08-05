export default function AuthGroupLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
