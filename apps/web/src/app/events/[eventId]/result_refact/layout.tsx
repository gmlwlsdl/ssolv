interface ResultLayoutProps {
  children: React.ReactNode;
}

const ResultLayout = ({ children }: ResultLayoutProps) => {
  return <div className="flex flex-1 background-3">{children}</div>;
};

export default ResultLayout;
