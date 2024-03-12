import { Imessage } from "@/lib/store/messages";

function ReplyToMessage({message, style} : {message : Imessage | undefined, style: string}) {
    return (
        <div  id="paragraph" className={`text-sm rounded-sm border-l-8 border-l-violet-700 p-1 flex flex-col ${style}`}>
            <p className="font-bold">{message?.users?.display_name}</p>
            <p dir="auto" className="text-gray-300 w-fit break-all">{message?.text}</p>
        </div>
    );
}

export default ReplyToMessage;