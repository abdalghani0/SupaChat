import { Imessage } from "@/lib/store/messages";

function ReplyToMessage({message, style} : {message : Imessage | undefined, style: string}) {
    return (
        <div  id="paragraph" className={`text-sm text-white rounded-sm border-l-8 border-l-violet-700 p-1 flex flex-col ${style}`}>
            <p className="font-bold">{message?.users?.display_name}</p>
            <p dir="auto" className={`text-gray-300 line-clamp-3 w-fit break ${style}`}>{message?.text}</p>
        </div>
    );
}

export default ReplyToMessage;