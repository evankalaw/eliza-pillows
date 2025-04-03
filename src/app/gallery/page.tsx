export default function Gallery() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="w-full h-full bg-red-500 p-24">
            <h1>Pillow {index + 1}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
