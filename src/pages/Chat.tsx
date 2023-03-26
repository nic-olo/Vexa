import React, { useEffect, useRef, useState } from "react";
import BaseCard from "../component/questionCards/BaseCard";
import CheckBoxCard from "../component/questionCards/CheckBoxCard";
import EndingCard from "../component/questionCards/EndingCard";
import UserResponseCard from "../component/questionCards/UserResponseCard";
import VideoCard from "../component/questionCards/VideoCard";
import YesNoCard from "../component/questionCards/YesNoCard";
import SelectionCard from "../component/questionCards/SelectionCard";
import Layout from "../component/Layout";

export type Video = {
  name: string;
  description: string;
  url: string;
};

export type FeedItem = {
  question: string;
  type:
    | "yesNo"
    | "checkBox"
    | "text"
    | "base"
    | "userResponse"
    | "video"
    | "options"
    | "ending";
  url?: string;
  answer?: string;
  options?: string[];
};

const questions: FeedItem[] = [
  {
    question:
      "Good evening Thomas. Welcome to VEXA. We will ask you a few questions and perform a few simple health checks before you see the physician?",
    type: "base",
  },
  {
    question: "Who are you booking for?",
    type: "options",
    options: ["Me", "Someone else"],
  },
  { question: "How can we help you today?", type: "text" },
  { question: "Where is the pain exactly?", type: "text" },
  { question: "When did the pain first start?", type: "text" },
  { question: "How does the pain feel like?", type: "text" },
  {
    question: "Does the pain spread anywhere else? If so, where?",
    type: "text",
  },
  {
    question:
      "On a scale of 0 to 10, how severe is the pain if 0 is being painless and 10 is the worst pain you have ever experienced?",
    type: "text",
  },
  { question: "Are you feeling fevershin?", type: "yesNo" },
  { question: "Do you have yellowing skin?", type: "yesNo" },
  { question: "Are you feeling fatigued?", type: "yesNo" },
  { question: "Are you feeling confused?", type: "yesNo" },
  {
    question: "Do a Scleral Icterus test, here is how to do it",
    url: "https://www.youtube.com/embed/4s217pWPMNI?autoplay=1",
    type: "video",
  },
  {
    question: "Do an Abdominal Palpation test, here is how to do it",
    url: "https://www.youtube.com/embed/SooocPBpNaU?autoplay=1",
    type: "video",
  },
];

export default function Chat() {
  const [myTurn, setMyTurn] = useState(false);
  const [feedItemCounter, setFeedItemCounter] = useState(0);
  const [displayedFeedItems, setDisplayedFeedItems] = useState<FeedItem[]>([]);
  const chatInputRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const addResponse = () => {
    questions[feedItemCounter].answer = input;
    console.log(questions);
    let userResponse: FeedItem = {
      question: input,
      type: "userResponse",
    };
    setDisplayedFeedItems([...displayedFeedItems, userResponse]);
    setInput("");
    setFeedItemCounter((counter) => counter + 1);
    setMyTurn(false);
  };

  const addCustomResponse = (option: string) => {
    questions[feedItemCounter].answer = option;
    console.log(questions);
    let userResponse: FeedItem = {
      question: option,
      type: "userResponse",
    };
    setDisplayedFeedItems([...displayedFeedItems, userResponse]);
    setInput("");
    setFeedItemCounter((counter) => counter + 1);
    setMyTurn(false);
  };

  const addYesResponse = () => {
    questions[feedItemCounter].answer = "Yes";
    let userResponse: FeedItem = {
      question: "Yes",
      type: "userResponse",
    };
    setDisplayedFeedItems([...displayedFeedItems, userResponse]);
    setFeedItemCounter((counter) => counter + 1);
    setMyTurn(false);
  };

  const addNoResponse = () => {
    questions[feedItemCounter].answer = "No";
    let userResponse: FeedItem = {
      question: "No",
      type: "userResponse",
    };
    setDisplayedFeedItems([...displayedFeedItems, userResponse]);
    setFeedItemCounter((counter) => counter + 1);
    setMyTurn(false);
  };

  const mapCard = (question: FeedItem, key: number) => {
    if (question.type === "yesNo") {
      return (
        <YesNoCard
          key={key}
          question={question.question}
          clickYes={addYesResponse}
          clickNo={addNoResponse}
        />
      );
    }

    if (question.type === "checkBox") {
      return <CheckBoxCard key={key} />;
    }

    if (question.type === "text") {
      return <BaseCard key={key} message={question.question} />;
    }

    if (question.type === "userResponse") {
      return <UserResponseCard key={key} message={question.question} />;
    }

    if (question.type === "base") {
      return <BaseCard key={key} message={question.question} />;
    }

    if (question.type === "video") {
      return (
        <VideoCard
          key={key}
          description={question.question}
          url={question.url ?? ""}
          clickYes={addYesResponse}
          clickNo={addNoResponse}
        />
      );
    }

    if (question.type === "options") {
      return (
        <SelectionCard
          key={key}
          question={question.question}
          options={question.options!}
          selectChoice={addCustomResponse}
        />
      );
    }

    if (question.type === "ending") {
      return <EndingCard />;
    }
  };

  useEffect(() => {
    console.log(displayedFeedItems);
    console.log(questions);
  }, [displayedFeedItems]);

  useEffect(() => {
    if (myTurn) {
      return;
    }

    setTimeout(() => {
      // Socrates questions
      if (feedItemCounter < questions.length) {
        let question = questions[feedItemCounter];
        setDisplayedFeedItems([...displayedFeedItems, question]);
        if (
          question.type === "text" ||
          question.type === "yesNo" ||
          question.type === "video" ||
          question.type === "options"
        ) {
          setMyTurn(true);
        } else {
          setFeedItemCounter(feedItemCounter + 1);
        }
      }

      if (feedItemCounter === questions.length) {
        console.log(
          questions.map((q) => {
            return {
              question: q.question,
              answer: q.answer,
            };
          })
        );
        const newFeedItem: FeedItem = {
          question: "",
          type: "ending",
        };
        setDisplayedFeedItems([...displayedFeedItems, newFeedItem]);
      }
    }, 1000);
  }, [feedItemCounter]);

  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.scrollTop = chatInputRef.current.scrollHeight;
    }
  }, [displayedFeedItems]);

  return (
    <Layout>
      <div className="flex flex-col w-full">
        <div className="px-3 py-5 flex-grow">
          {displayedFeedItems.map((item, i) => mapCard(item, i))}
        </div>

        <div
          ref={chatInputRef}
          className="flex justify-center
        items-center bg-base-300 px-5 py-3 gap-3 w-full"
        >
          <textarea
            rows={1}
            value={input}
            className="textarea textarea-bordered textarea-sm w-full flex-grow outline"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addResponse();
              }
            }}
            disabled={!myTurn}
          ></textarea>
          <button
            className="btn btn-sm flex-grow-0"
            disabled={!myTurn}
            onClick={addResponse}
          >
            <span>Add</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
