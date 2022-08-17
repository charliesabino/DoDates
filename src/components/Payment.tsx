import React from 'react'

export default function Payment() {
  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
    }

    if (query.get('canceled')) {
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      )
    }
  }, [])

  return (
    <form action='/api/checkout_sessions' method='POST'>
      <section>
        <button
          type='submit'
          role='link'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded'
        >
          Add Payment Method
        </button>
      </section>
    </form>
  )
}