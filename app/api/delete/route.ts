import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TABLE_NAME = 'participants'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const createSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  })
}

export async function POST(request: Request) {
  const supabaseAdmin = createSupabaseAdmin()
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase service role key missing' },
      { status: 500 }
    )
  }

  let deleteToken = ''
  try {
    const body = (await request.json()) as { deleteToken?: string }
    deleteToken = body.deleteToken ?? ''
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof deleteToken !== 'string' || !deleteToken.trim()) {
    return NextResponse.json({ error: 'Missing deleteToken' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .delete()
    .eq('deleteToken', deleteToken)
    .select('id')

  if (error) {
    console.error('[Supabase] Error deleting participant:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ deleted: false }, { status: 404 })
  }

  return NextResponse.json({ deleted: true }, { status: 200 })
}
