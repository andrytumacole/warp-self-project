interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

function WorkspaceIdPage(props: Readonly<WorkspaceIdPageProps>) {
  const { params } = props;
  return (
    <div className="w-full h-full flex justify-center items-center">
      ID: {params.workspaceId}
    </div>
  );
}

export default WorkspaceIdPage;
