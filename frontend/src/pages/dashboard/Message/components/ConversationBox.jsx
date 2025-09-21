function ConversationBox({ conversations, setCurrentConversation }) {
  return (
    <>
      {conversations?.length === 0 ? (
        <div className="text-gray-500 flex justify-center items-center h-full">
          <span> Don't have conversation</span>
        </div>
      ) : (
        conversations?.map((conv) => (
          <div
            key={conv?.id}
            onClick={() => setCurrentConversation(conv)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              conv?.active ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {conv?.name?.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conv?.name}
                  </p>
                  {conv?.isDelete > 0 && (
                    <span className="text-red-600 text-xs">Deleted</span>
                  )}
                  <span className="text-xs text-gray-500">
                    {conv?.lastMessageTime}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conv?.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default ConversationBox;
