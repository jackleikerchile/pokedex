import { useEffect, useState } from "react";
import { useForm } from "../hook/useForm";
import { PokemonContext } from "./PokemonContext";

export const PokemonProvider = ({children}) => {

     const [allPokemons, setAllPokemons] = useState([])
     const [globalPokemons, setGlobalPokemons] = useState([])
     const [offset, setOffset] = useState(0)

     // Use CustomHook - useForm
     const {valueSearch, onInputChange, onResetForm} = useForm({
        valueSearch: ''
     })

     // Simple Application States
     const [loading, setLoading] = useState(true)
     const [active, setActive] = useState(false)


    // Call 50 Pokemons to the API
    const getAllPokemons = async(limit = 50) => {
        const baseURL = 'https://pokeapi.co/api/v2/'

        const res = await fetch(`${baseURL}pokemon?limit=${limit}&offset=${offset}`)
        const data = await res.json()

        const promise = data.results.map(async(pokemon) => {
            const res = await fetch(pokemon.url)
            const data = await res.json()
            return data
        })
        const results = await Promise.all(promise)

    setAllPokemons([...allPokemons, ...results]);
    setLoading(false)
    }

    // Call all the Pokemons
    const getGlobalPokemons = async() => {

        const baseURL = 'https://pokeapi.co/api/v2/'

        const res = await fetch(`${baseURL}pokemon?limit=100000&offset=0`)
        const data = await res.json()

        const promise = data.results.map(async(pokemon) => {
            const res = await fetch(pokemon.url)
            const data = await res.json()
            return data
        })
        const results = await Promise.all(promise)

    setGlobalPokemons(results)
    setLoading(false)
    }

    // Call a Pokemon by ID
    const getPokemonByID = async(id) => {
        const baseURL = 'https://pokeapi.co/api/v2/'

        const res = await fetch(`${baseURL}pokemon/${id}`)
        const data = await res.json()
        return data
    }

    useEffect(() => {
        getAllPokemons()
    }, [offset]);

    useEffect(() => {
        getGlobalPokemons()
    }, []);


    // BTN Load More
    const onClickLoadMore = () => {
        setOffset(offset + 50)
    }

    //Filter Funtion + State
    const [typeSelected, setTypeSelected] = useState({
        grass: false,
		normal: false,
		fighting: false,
		flying: false,
		poison: false,
		ground: false,
		rock: false,
		bug: false,
		ghost: false,
		steel: false,
		fire: false,
		water: false,
		electric: false,
		psychic: false,
		ice: false,
		dragon: false,
		dark: false,
		fairy: false,
		unknow: false,
		shadow: false,
    })
    const [filteredPokemons, setfilteredPokemons] = useState([])

    const handleCheckbox = e => {
        setTypeSelected({
            ...typeSelected,
            [e.target.name]: e.target.checked
        })

        if(e.target.checked) {
            const filteredResults = globalPokemons.filter(pokemon => 
                pokemon.types
                .map(type => type.type.name)
                .includes(e.target.name)
        );
        setfilteredPokemons([...filteredPokemons, ...filteredResults])
    } else {
        const filteredResults = filteredPokemons.filter(pokemon => 
            !pokemon.types
            .map(type => type.type.name)
            .includes(e.target.name)
    );
    setfilteredPokemons([...filteredResults])
    }
    }
  return (
    <PokemonContext.Provider value={{
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        globalPokemons,
        getPokemonByID,
        onClickLoadMore,
        // Loader
        loading,
        setLoading,
        // Btn Filter
        active,
        setActive,
        // Filter Container Checkbox
        handleCheckbox,
        filteredPokemons
    }}>
        {children}
    </PokemonContext.Provider>
  );
}
