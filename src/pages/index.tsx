import type { NextPage } from 'next'
import Head from 'next/head'
import { trpc } from '../utils/trpc'
import { DoDate } from '@prisma/client'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { comment } from 'postcss'

const DoDateItem: React.FC<{
  doDate: DoDate
}> = ({ doDate }) => {
  const completeMutation = trpc.useMutation(['dodate.update-doDate'])

  const deleteMutation = trpc.useMutation(['dodate.delete-doDate'])

  const onChange = () => {
    doDate.done = !doDate.done
    completeMutation.mutate({ ...doDate })
  }

  return (
    <div key={doDate.id} className='flex gap-2 rounded p-4 md:w-1/2 w-full'>
      <input type='checkbox' checked={doDate.done} onChange={onChange}></input>
      <span className={classNames({ 'line-through': doDate.done })}>
        {doDate.text}
      </span>
      <button onClick={() => deleteMutation.mutate({ id: doDate.id })}>X</button>
    </div>
  )
}

const CreateDoDateForm: React.FC = () => {
  const utils = trpc.useContext()

  const mutation = trpc.useMutation(['dodate.create-doDate'], {
    onSuccess() {
      utils.invalidateQueries(['dodate.get-doDates'])
    },
  })
  const [text, setText] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value)

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    mutation.mutate({ text })
    setText('')
  }

  return (
    <form
      className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'
      onSubmit={onSubmit}
    >
      <input
        className='border-2 rounded border-gray-600 p-1'
        type='text'
        placeholder='Create a new DoDate'
        onChange={onChange}
        value={text}
      />
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        type='submit'
      >
        Submit
      </button>
    </form>
  )
}

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['dodate.get-doDates'])
  const [doDates, setDoDates] = useState<DoDate[]>([])

  useEffect(() => {
    if (data) {
      setDoDates(data)
    }
  }, [data])

  if (isLoading) return null

  return (
    <>
      <Head>
        <title>DoDate</title>
        <meta name='description' content='Hold yourself accountable.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='container mx-auto flex flex-col items-center justify-center h-screen p-4'>
        <div>
          <h1 className='text-center font-bold text-2xl mt-4'>DoDates</h1>
          <CreateDoDateForm />
          {doDates.map((doDate) => (
            <DoDateItem key={doDate.id} doDate={doDate} />
          ))}
        </div>
      </main>
    </>
  )
}

export default Home
