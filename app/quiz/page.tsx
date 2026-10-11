"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

const questions = [
  { question: "Which film features the character Jack Dawson?", options: ["Titanic", "The Notebook", "Cast Away", "A Beautiful Mind"], answer: 0, note: "Leonardo DiCaprio plays Jack Dawson in James Cameron's Titanic." },
  { question: "Which fictional city is Batman most associated with?", options: ["Metropolis", "Gotham City", "Star City", "Central City"], answer: 1, note: "Batman protects Gotham City." },
  { question: "Which movie franchise features the Infinity Stones?", options: ["Fast & Furious", "Harry Potter", "Marvel Cinematic Universe", "Jurassic Park"], answer: 2, note: "The Infinity Stones are central to several Marvel Cinematic Universe stories." },
  { question: "Who directed the film Jaws (1975)?", options: ["Christopher Nolan", "Steven Spielberg", "Ridley Scott", "James Cameron"], answer: 1, note: "Steven Spielberg directed the thriller Jaws." },
  { question: "In which series would you find the town of Hawkins?", options: ["Dark", "The Last of Us", "Stranger Things", "Wednesday"], answer: 2, note: "Stranger Things is set largely in Hawkins, Indiana." }
];
export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const question = questions[index];
  const score = answers.reduce((total, answer, i) => total + (answer === questions[i].answer ? 1 : 0), 0);
  const choose = (option: number) => { if (answers[index] !== undefined) return; setAnswers((old) => [...old.slice(0, index), option, ...old.slice(index + 1)]); };
  const next = () => { if (index === questions.length - 1) setFinished(true); else setIndex((i) => i + 1); };
  const restart = () => { setIndex(0); setAnswers([]); setFinished(false); };
  return <main className="mx-auto max-w-3xl py-8"><p className="mb-2 text-sm uppercase tracking-widest text-neon-pink">Play & test yourself</p><h1 className="text-3xl font-extrabold">Movie & TV Quiz</h1><p className="mt-2 text-neutral-400">Five quick questions for film and series fans.</p><section className="mt-7 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 md:p-8">{finished ? <div className="py-8 text-center"><div className="text-5xl font-black gradient-text">{score}/{questions.length}</div><h2 className="mt-4 text-2xl font-bold">{score === questions.length ? "Perfect score!" : score >= 3 ? "Great movie knowledge!" : "Keep watching and try again!"}</h2><p className="mt-2 text-neutral-400">You answered {score} of {questions.length} questions correctly.</p><button onClick={restart} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neon-pink px-5 py-3 font-semibold"><RotateCcw size={17}/> Play again</button></div> : <><div className="mb-5 flex items-center justify-between text-sm text-neutral-400"><span>Question {index + 1} of {questions.length}</span><span>{Math.round((index / questions.length) * 100)}% complete</span></div><div className="mb-6 h-1.5 overflow-hidden rounded-full bg-neutral-800"><div className="h-full bg-neon-pink transition-all" style={{ width: `${(index + 1) / questions.length * 100}%` }}/></div><h2 className="text-xl font-bold">{question.question}</h2><div className="mt-5 grid gap-3">{question.options.map((option, i) => { const selected = answers[index] === i; const answered = answers[index] !== undefined; const correct = i === question.answer; return <button key={option} onClick={() => choose(i)} disabled={answered} className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${answered && correct ? "border-emerald-500 bg-emerald-500/10" : selected ? "border-red-500 bg-red-500/10" : "border-neutral-700 hover:border-neon-pink"}`}><span>{option}</span>{answered && correct ? <CheckCircle2 className="text-emerald-400" size={18}/> : answered && selected ? <XCircle className="text-red-400" size={18}/> : null}</button>; })}</div>{answers[index] !== undefined && <><p className="mt-5 text-sm text-neutral-300">{question.note}</p><button onClick={next} className="mt-5 rounded-lg bg-neon-pink px-5 py-3 font-semibold">{index === questions.length - 1 ? "See results" : "Next question"}</button></>}</>}</section><p className="mt-5 text-sm text-neutral-500">Explore more titles on <Link href="/movies" className="text-neon-pink underline">Tokyo Updates</Link>.</p></main>;
}
