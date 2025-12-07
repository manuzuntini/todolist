const supabase = require('../lib/supabaseClient')

async function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(401).json({ message: 'No token provided' })
    const token = authHeader.replace('Bearer ', '')
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    req.user = data.user
    next()
  } catch (err) {
    console.error('Auth error', err)
    res.status(500).json({ message: 'Auth failure' })
  }
}

module.exports = checkAuth
