const Tag = ({ text }: { text: string }) => {
  return (
    <span className="rounded-full bg-purple-200 px-3 py-1 text-purple-900 dark:bg-purple-400/20 dark:text-purple-300">
      {text}
    </span>
  );
};

export default Tag;
