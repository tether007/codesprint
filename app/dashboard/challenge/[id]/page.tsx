export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">
        Challenge {id}
      </h2>

      <p className="text-zinc-400 mb-6">
        This is the content for Challenge {id}.
      </p>

      <input
        type="text"
        placeholder="Enter flag..."
        className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg w-full max-w-md"
      />
    </div>
  );
}
