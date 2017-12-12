const getUserAge = () : string | null => "32"

// getUserAge could return null - but 
// parseInt only takes a string
parseInt(getUserAge())
