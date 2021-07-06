import './Pokedex.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

function PokemonInfo(props) {
  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <div>
      <button onClick={open}>Show data</button>
      <Dialog isOpen={showDialog} onDismiss={close} className="pokemon-pop-up">
        <p className="pokemon-name">{props.pokemon.name}</p>
        <div className="pokemon-sprite">
          <img src={props.pokemon.sprite} alt={props.pokemon.name}/>
        </div>
        <p>Ability One: {props.pokemon.abilityOne}</p>
        <p>Type One: {props.pokemon.typeOne}</p>
        <p>Weight: {props.pokemon.weight}</p>
        <p>HP: {props.pokemon.hp}</p>
        <p>Attack: {props.pokemon.attack}</p>
        <p>Defense: {props.pokemon.defense}</p>
        <p>Speed: {props.pokemon.speed}</p>
        <button onClick={close}>Close</button>
      </Dialog>
    </div>
  );
}

function Pokedex(props) {
  const [pokemons, setPokemons] = useState([])
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [showFavorites, setShowFavorites] = useState(false)

  const observer = useRef()
  const lastEntryRef = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !showFavorites) {
        setPageNumber(pageNumber => pageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [showFavorites])

  function onClickFavorite(pokemonName) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {username: props.username, password: props.password} )
    }

    fetch("https://pokedex-backend02.herokuapp.com/api/pokemon/" + pokemonName + "/favorite/", requestOptions)
    .then(response => response.json())
    .then(function(data) {
      
    })
  }

  useEffect(() => {
    if (showFavorites) {
      setPokemons([])
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {username: props.username, password: props.password} )
      }
      fetch("https://pokedex-backend02.herokuapp.com/api/favoritepokemon/", requestOptions)
      .then(response => response.json())
      .then(function(fpData) {
        for (const pokemon of fpData) {
          fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon.name)
          .then(response => response.json())
          .then(pokemonData => setPokemons(pokemons => [...pokemons, {name: pokemon.name, sprite: pokemonData.sprites.front_default, abilityOne: pokemonData.abilities[0].ability.name,
            typeOne: pokemonData.types[0].type.name, weight: pokemonData.weight, hp: pokemonData.stats[0].base_stat,
            attack: pokemonData.stats[1].base_stat, defense: pokemonData.stats[2].base_stat,
            speed: pokemonData.stats[5].base_stat}]))
        }
      })
      return
    }
    let offset = (pageNumber - 1) * 20;
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=" + offset.toString())
    .then(response => response.json())
    .then(function(data){
      if (pageNumber > 1) {
        if (query !== '') {
          
        } else {
          setPokemons(pokemons => [...pokemons, ...data.results])
        }
      } else if (query !== '') {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=898")
        .then(response => response.json())
        .then(function(allData){
          let filteredData = allData.results.filter(pokemon => pokemon.name.includes(query, 0))
          setPokemons(filteredData)
          pokemons.forEach(function(pokemon){
            fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon.name)
            .then(response => response.json())
            .then(function(pokemonData){
              setPokemons(pokemons => pokemons.map(data => data.name === pokemon.name ?
                {...data, sprite: pokemonData.sprites.front_default, abilityOne: pokemonData.abilities[0].ability.name,
                  typeOne: pokemonData.types[0].type.name, weight: pokemonData.weight, hp: pokemonData.stats[0].base_stat,
                  attack: pokemonData.stats[1].base_stat, defense: pokemonData.stats[2].base_stat,
                  speed: pokemonData.stats[5].base_stat} : data))
            })
          })
        })
        return
      } else {
        setPokemons(data.results);
      }
      data.results.forEach(function(pokemon){
        fetch(pokemon.url)
        .then(response => response.json())
        .then(function(pokemonData) {
          //pokemon.sprite = pokemonData.sprites.front_default;
          setPokemons(pokemons => pokemons.map(data => data.name === pokemon.name ?
            {...data, sprite: pokemonData.sprites.front_default, abilityOne: pokemonData.abilities[0].ability.name,
              typeOne: pokemonData.types[0].type.name, weight: pokemonData.weight, hp: pokemonData.stats[0].base_stat,
              attack: pokemonData.stats[1].base_stat, defense: pokemonData.stats[2].base_stat,
              speed: pokemonData.stats[5].base_stat} : data))
        })
      })
    })
  }, [query, pageNumber, showFavorites]);

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  function onClickLogout() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': 'Token ' + props.token },
      body: {}
    }
    console.log(requestOptions.headers)
    fetch("https://pokedex-backend02.herokuapp.com/api/logout/", requestOptions)
    .then(function(response) {
      if (response.statusText === "No Content") {
        window.location.reload()
      }
    })
  }
    
  return (
    <div className="pokedex">
      <button onClick={onClickLogout}>Logout</button>
      <button onClick={() => setShowFavorites(!showFavorites)}>Filter by Favorites</button>
      <div id="search-bar-div">
        <input type="text" value={query} onChange={handleSearch}></input>
      </div>
      <div className="pokedex-body">
        <div className="left-empty"/>
        <div className="all-entries">
          {pokemons.map((pokemon, index) => {
            if (pokemons.length === index + 1) {
              return (
                <div ref={lastEntryRef} key={pokemon.name} className="pokemon-entry">
                  <p className="pokemon-name">{pokemon.name}</p>
                  <div className="pokemon-sprite">
                    <img src={pokemon.sprite} alt={pokemon.name}/>
                  </div>
                  <button onClick={() => onClickFavorite(pokemon.name)}>Favorite</button>      
                  <PokemonInfo pokemon={pokemon}/>
                </div>
              )
            } else {
              return (
                <div key={pokemon.name} className="pokemon-entry" >
                  <p className="pokemon-name">{pokemon.name}</p>
                  <div className="pokemon-sprite">
                    <img src={pokemon.sprite} alt={pokemon.name}/>
                  </div>
                  <button onClick={() => onClickFavorite(pokemon.name)}>Favorite</button>
                  <PokemonInfo pokemon={pokemon}/>
                </div>
              )
            }
          })}
        </div>
        <div className="right-empty"/>
      </div>
    </div>
  )
}

export default Pokedex;
