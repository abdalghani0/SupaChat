"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CornerUpLeft, MoreHorizontal } from "lucide-react";
import { useUser } from "@/lib/store/user";
import { User } from "@supabase/supabase-js";
import ReplyToMessage from "./ReplyToMessage";
import { CopyBlock, dracula } from "react-code-blocks";

export default function Message({ message }: { message: Imessage }) {
    const user = useUser((state) => state.user);
    const { messages, aiMessages } = useMessage();
    const replyToMessage =
        message?.users?.id == "1" || message?.users?.id == "0"
            ? aiMessages?.find((m) => m.id === message.replying_to)
            : message.replying_to
                ? messages?.find((m) => m.id === message.replying_to)
                : undefined;
    const { setReplyToMessage } = useMessage();

    // Function to modify message to containe links and code snippets
    const replaceMessage = (text: string) => {
        // Define patterns
        const boldPattern = /\*\*(.*?)\*\*/g;
        const codeBlockPattern = /```(.*?)```/gs;
        const anchorPattern = /https?:\/\//g;

        // Function to process bold text
        const processBoldText = (text: string) => {
            return text.split(boldPattern).map((part, index) => {
                if (index % 2 === 1) {
                    return <strong key={`bold-${index}`}>{part}</strong>;
                } else {
                    return part;
                }
            });
        };

        // Function to process anchor text
        const processAnchorText = (text: string) => {
            return text.split(anchorPattern).map((part, index) => {
                if (index % 2 === 1) {
                    return <><br /><a className="hover:text-violet-300 underline break-all" key={`anchor-${index}`} href={part}>{part}</a><br /></>;
                } else {
                    return part;
                }
            });
        };

        // Split the text by code block pattern first
        const parts = text.split(codeBlockPattern).map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <CopyBlock
                        language={part.split(/\s/).at(0)!}
                        text={part}
                        showLineNumbers
                        theme={dracula}
                        customStyle={{ overflow: "auto" }}
                    />
                )
            } else {
                // Further process the non-code-block part for bold text and anchor text
                return processBoldText(part).map((subPart, subIndex) => {
                    if (typeof subPart === 'string') {
                        return processAnchorText(subPart);
                    } else {
                        return subPart;
                    }
                });
            }
        });

        // Flatten the array of arrays
        return parts.reduce<React.ReactNode[]>((acc, val) => acc.concat(val), []);
    };

    //highlights the replied to message
    const handleRepliedMessageClick = () => {
        document.getElementById(replyToMessage?.id!)?.classList.add("bg-gray-200", "dark:bg-gray-700");
        setTimeout(() => {
            document
                .getElementById(replyToMessage?.id!)
                ?.classList.remove("bg-gray-200", "dark:bg-gray-700");
        }, 500);
    };

    const handleDoubleClick = () => {
        setReplyToMessage(message);
        document.getElementById("chat-input")?.focus();
        document.getElementById("chat-input")?.click();
        document.getElementById("ai-input")?.focus();
        document.getElementById("ai-input")?.click();
    };

    return (
        <div
            id={message.id}
            onDoubleClick={() => handleDoubleClick()}
            className={`text-sm rounded-md transision-bg duration-500 ${message.send_by === user?.id || message.send_by == "0"
                ? ""
                : "flex justify-end"
                }`}
        >
            <div
                className={`w-fit max-w-xs sm:max-w-md bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-700 dark:to-cyan-700 rounded-md p-3 `}
            >
                {message.replying_to ? (
                    <a
                        onClick={() => handleRepliedMessageClick()}
                        href={`#${replyToMessage?.id}`}
                    >
                        <ReplyToMessage
                            message={replyToMessage}
                            style={`cursor-pointer w-full bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-900 dark:to-cyan-900 ${message.send_by === user?.id || message.send_by == "0"
                                ? "bg-gradient-to-l mr-10"
                                : ""
                                }`}
                        />
                    </a>
                ) : null}
                <div
                    className={`flex gap-2 ${message.send_by === user?.id || message.send_by == "0"
                        ? ``
                        : `flex-row-reverse`
                        }`}
                >
                    <div className="shrink-0">
                        <Image
                            src={message.users?.avatar_url!}
                            alt={message.users?.display_name!}
                            width={40}
                            height={40}
                            className="rounded-full ring-2"
                        />
                    </div>

                    <div dir="rtl" className="flex-1 overflow-x-auto flex max-w-full flex-col">
                        <div
                            className={`flex items-center gap-2 justify-between  ${message.send_by === user?.id || message.send_by == "0"
                                ? "flex-row-reverse"
                                : ""
                                }`}
                        >
                            <div
                                className={`flex items-center gap-2 ${message.send_by === user?.id || message.send_by == "0"
                                    ? "flex-row-reverse"
                                    : ""
                                    }`}
                            >
                                <h1 className="font-bold text-white">{message.users?.display_name}</h1>
                                {message.is_edit && (
                                    <h1 className="test-sm text-gray-200 dark:text-gray-400">edited</h1>
                                )}
                            </div>
                            <MessageMenu user={user} message={message} />
                        </div>
                        <div
                            dir="auto"
                            className={`text-gray-200 dark:text-gray-300 text-clip w-full break-words ${message.send_by === user?.id || message.send_by == "0"
                                ? "float-left"
                                : ""
                                }`}
                        >
                            {replaceMessage(message.text)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const MessageMenu = ({
    message,
    user,
}: {
    message: Imessage;
    user: User | undefined;
}) => {
    const setActionMessage = useMessage((state) => state.setActionMessage);
    const { setReplyToMessage } = useMessage();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-white">
                <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    {new Date(message.created_at).toDateString() +
                        " " +
                        new Date(message.created_at).getHours() +
                        ":" +
                        new Date(message.created_at).getMinutes()}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        setReplyToMessage(message);
                    }}
                >
                    reply <CornerUpLeft className="w-4 h-4" />
                </DropdownMenuItem>
                {message.users?.id === user?.id || message.users?.id === "0" ? (
                    <>
                        <DropdownMenuItem
                            onClick={() => {
                                document.getElementById("trigger-edit")?.click();
                                setActionMessage(message);
                            }}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                document.getElementById("trigger-delete")?.click();
                                setActionMessage(message);
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
