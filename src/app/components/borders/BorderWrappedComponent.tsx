import { NotchedBorder } from "./NotchedBorder";

export default function BorderWrappedComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotchedBorder className="h-full w-full" size="large">
      <div className="flex flex-col h-full p-10">{children}</div>
    </NotchedBorder>
  );
}
