'use client'

import {Loader2} from "lucide-react"
import {useForm} from 'react-hook-form'
import {useState, useEffect, useCallback} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import ParsingResult from "@/components/parsing-result";
import WASM from "@/wasm/playground.js"


let wasm: { parse: (url: string) => Record<string, any> };

function toJS(obj: Record<string, any>) {
   const result: Record<string, any> = {};
   for (const key of Object.keys(obj.__proto__)) {
        result[key] = typeof obj[key] === "object" ? toJS(obj[key]) : obj[key];
   }
   return result;
}

export default function Home() {
    const router = useRouter()
    const {toast} = useToast()
    const [loading, setLoading] = useState(false)
    const {handleSubmit, register} = useForm<{ url: string }>()
    const [output, setOutput] = useState<Record<string, any> | undefined>()
    const searchParams = useSearchParams()
    const defaultValue = searchParams.get("url") ?? ""
    const onSubmit = useCallback(async (data: {url: string}) => {
        setLoading(true)
        try {
            wasm = wasm ?? await WASM();
            const result = wasm.parse(data.url);
            setOutput(toJS(result));
            result.delete();
            router.replace(`/?url=${data.url}`)
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
    }, [router, toast])

    useEffect(() => {
        if (defaultValue?.length > 0) {
            onSubmit({ url: defaultValue })
        }
    }, [defaultValue, onSubmit])

    return (
        <main className='max-w-4xl mx-auto flex flex-col gap-y-8 my-12 px-4 lg:px-0'>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Ada URL Parser Playground
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-row space-x-4'>
                <Input
                    type='text'
                    required
                    placeholder='Please enter a valid URL to parse through Ada'
                    defaultValue={defaultValue}
                    {...register('url', {required: true})}
                />

                <Button disabled={loading} className='w-32'>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Parse
                </Button>
            </form>

            {output !== undefined && <ParsingResult {...output as any} />}

            <footer className='text-sm'>
                Ada is available through <a target='_blank' className='font-semibold underline' href="https://github.com/ada-url/ada">ada-url/ada github repository</a>.
            </footer>
        </main>
    )
}
