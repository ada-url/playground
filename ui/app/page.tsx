'use client'

import {Loader2, Terminal} from "lucide-react"
import {useForm} from 'react-hook-form'
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import ParsingResult from "@/components/parsing-result";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://0.0.0.0:4242'

export default function Home() {
    const {toast} = useToast()
    const [loading, setLoading] = useState(false)
    const {handleSubmit, register} = useForm<{ url: string }>()
    const [output, setOutput] = useState<Record<string, any> | undefined>()
    const onSubmit = handleSubmit(async (data) => {
        setLoading(true)
        try {
            const search = new URLSearchParams()
            search.set('url', data.url)
            const response = await fetch(`${API_URL}/parse?${search.toString()}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'content-type': 'application/json',
                }
            })
            setOutput(await response.json())
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'An error occurred',
                    description: error.message,
                    variant: 'destructive'
                })
            }
            setOutput(undefined)
        } finally {
            setLoading(false)
        }
    })
    return (
        <main className='max-w-4xl mx-auto flex flex-col gap-y-8 my-12'>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Ada URL Parser Playground
            </h1>
            <form onSubmit={onSubmit} className='flex flex-row space-x-4'>
                <Input
                    type='text'
                    required
                    placeholder='Please enter a valid URL to parse through Ada'
                    {...register('url', {required: true})}
                />

                <Button disabled={loading} className='w-24'>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Parse it
                </Button>
            </form>

            {output !== undefined && <ParsingResult {...output as any} />}
        </main>
    )
}
