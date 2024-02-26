<script>
import { auth } from '../firebase/init.js'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref, child, get, set } from "firebase/database";

export default {
    data() {
        return {
            pokemones: [],
            newMessage: '',
            endpoint: "https://us-central1-pokedex-eb227.cloudfunctions.net/pokedex",
            isLoggedIn: false,
            email: '',
            password: '',
            movileMax760: false,
            pokeInfo: 'Pokemon Info',
            pokemonName: 'Pokemon Name',
            pokemonEndpoint: 'https://pokeapi.co/api/v2/pokemon?limit=4&offset=0',
            pokemonEndpoint2: '',
            pokeEndPointPage: 0,
            selectedPokemon: '',
            pokemonAbilities: [],
            isPokemonSelected: false,
            selectedPokemonImage: '',
            isFavourite: false,
            pokemonSrch: '',
            pokemonFound: true,
        };
    },
    methods: {
        login() {
            signInWithEmailAndPassword(auth, this.email, this.password).then((data) => {
                this.isLoggedIn = true;
            }).catch(error => {
                switch (error.code) {
                    case 'auth/invalid-email':
                        alert('Invalid email')
                        break
                    case 'auth/user-not-found':
                        errMsg.value = 'No account with that email was found'
                        break
                    case 'auth/wrong-password':
                        errMsg.value = 'Incorrect password'
                        break
                    default:
                        errMsg.value = 'Email or password was incorrect'
                        break
                }
            });
        },
        selectPokemon(name) {
            this.pokemonName = name;
            this.pokemonEndpoint2 = 'https://pokeapi.co/api/v2/pokemon/'+name
            this.fetchData2();
            this.checkFavourite();
        },
        logout() {
            signOut(auth);
        },
        isMobile() {
            if (screen.width <= 760) {
                this.movileMax760 = true;
            }
        },
        async fetchData() {
            const pokendpoint = this.pokemonEndpoint;
            const httpOptions = { method:'POST', headers: { 'Content-Type': 'application/json', nombre: pokendpoint, pokesel: 'false' }};
            try {
                const e = await fetch(this.endpoint, httpOptions);
                if (!e.ok) throw new Error(e.status);
                const pokemons = await e.json();
                this.pokemones = pokemons;
                const imgpage = this.pokeEndPointPage;
                for (let step = 0; step < 4; step++) {
                    const imgg = step+1+imgpage;
                    this.pokemones[step].imagen = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/'+imgg+'.png';
                }
            } catch (e) {
                console.error("No se puede comunicar con el servidor:", e);
            };
        },
        async fetchData2() {
            const pokename = this.pokemonEndpoint2;
            console.log(pokename);
            const httpOptions = { method:'POST', headers: { 'Content-Type': 'application/json', nombre: pokename, pokesel: 'true' }};
            try {
                const e = await fetch(this.endpoint, httpOptions);
                if (!e.ok) throw new Error(e.status);
                const pokemons = await e.json();
                const height = pokemons.height;
                const weight = pokemons.weight;
                const abilities = pokemons.abilities;
                for (let step = 0; step < abilities.length; step++) {
                    this.pokemonAbilities[step] = abilities[step].ability.name;
                }
                const AllAbilities ='Abilities: '+ this.pokemonAbilities.toString().replaceAll(',',', ');
                this.isPokemonSelected = true;
                this.selectedPokemonImage = pokemons.sprites.front_shiny;
                this.pokeInfo = 'Height: ' + height + '\n' + 'Weight: ' + weight + '\n' + AllAbilities;
            } catch (e) {
                console.error("No se puede comunicar con el servidor:", e);
                alert('Pokemon not Found');
                this.pokeInfo = 'Pokemon Info';
                this.pokemonName = 'Pokemon Name';
            };
        },
        prevPage() {
            this.isPokemonSelected = false;
            if (this.pokeEndPointPage <= 0 ){
                console.log('First Page Reached');
            } else {
                const currentPage = this.pokeEndPointPage - 4;
                this.pokemonEndpoint = 'https://pokeapi.co/api/v2/pokemon?limit=4&offset='+currentPage;
                this.pokeEndPointPage = currentPage;
                this.fetchData();
            };
        },
        nextPage() {
            this.isPokemonSelected = false;
            const currentPage = this.pokeEndPointPage + 4;
            this.pokemonEndpoint = 'https://pokeapi.co/api/v2/pokemon?limit=4&offset='+currentPage;
            this.fetchData();
            this.pokeEndPointPage = currentPage;
        },
        regrAPoke() {
            this.isPokemonSelected = !this.isPokemonSelected;
        },
        addFavourite() {
            const nombre = this.pokemonName;
            const dbRef = getDatabase();
            set(ref(dbRef, 'pokemon/'+nombre), {
                favourite: true
            });
            this.isFavourite = true;
        },
        removeFavourite() {
            const nombre = this.pokemonName;
            const dbRef = getDatabase();
            set(ref(dbRef, 'pokemon/'+nombre), {
                favourite: null
            });
            this.isFavourite = false;
        },
        checkFavourite() {
            const nombre = this.pokemonName;
            const dbRef = ref(getDatabase());
            get(child(dbRef, 'pokemon/'+nombre)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.child('favourite').val());
                if (snapshot.child('favourite').val()){
                    this.isFavourite = true;
                }
            } else {
                console.log("Not on favourite");
                this.isFavourite = false
            }
            }).catch((error) => {
            console.error(error);
            });
        },
        searchPokemon() {
            const nameSrch = this.pokemonSrch
            this.selectPokemon(nameSrch);
        }
    },
    updated() {
        
    },
    mounted() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.isLoggedIn = true;
            } else {
                this.isLoggedIn = false;
            }
});
        
        this.fetchData();
    },
    created() {
        
    }
};
</script>

<template>
    <div class="pokedex-container" v-if="isLoggedIn">
        <div class="pokedex-container2">
            <div class="pokedex-container3">
                <img src="../assets/logo.jpg" class="logo-pokedex">
                <div class="pokedex-header-brand">Pokedex</div>
            </div>
        </div>
        <div class="logout-btn">
            <form @submit.prevent="sendMessage">
                <button type="button" class="btn btn-primary" @click="logout()">Salir</button>
            </form>
        </div>
        <div class="device-used">
            <div class="search-container">
                <div class="search-header">
                    <img class="pokedexHeader" src="../assets/pokedexheader.jpg">
                </div>
                <div class="search-image" v-if="!isPokemonSelected">
                    <ul class="pokemon-ul">
                        <li v-for="pokemon in pokemones" :key="pokemon.name" class="pokemon-item">
                            <div class="pokemon-image">
                                <img :src='pokemon.imagen' class="poke-img-style">
                            </div>
                            <div class="pokemon-name" v-on:click="selectPokemon(pokemon.name)">
                                {{ pokemon.name }}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="search-image" v-else>
                    <img :src='selectedPokemonImage'>
                </div>
                <div class="view-pagediv">
                    <form class="view-page" @submit.prevent="prevPage">
                        <button type="submit">&lt;</button>
                    </form>
                    <form class="view-page" @submit.prevent="nextPage">
                        <button type="submit">&gt;</button>
                    </form>
                </div>
                <form class="search-pokemon" @submit.prevent="searchPokemon">
                    <input v-model="pokemonSrch" type="text" placeholder="Pokemon Search" />
                    <button type="submit">Search Pokemon</button>
                </form>
                <br>
                <br>
                <div class="pokedex-footer">By Arturo Alonso</div>
            </div>
            <div class="info-container">
                <div class="pokemon-nameInf">
                    {{ pokemonName }}
                    <i class="bi bi-star-fill" v-if="isFavourite"></i>
                </div>
                <div>
                    <textarea v-model="pokeInfo" class="pokemon-info"></textarea>
                </div>
                <div class="info-pagediv2">
                    <form class="info-page" @submit.prevent="addFavourite">
                        <button type="submit">Agregar a Favoritos</button>
                    </form>
                    <form class="info-page" @submit.prevent="removeFavourite">
                        <button type="submit">Eliminar de Favoritos</button>
                    </form>
                </div>
                <div class="info-pagediv">
                    <form class="info-page" @submit.prevent="regrAPoke">
                        <button type="submit">Regresar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="login-screen" v-if="!isLoggedIn">
        <h1 class="login-screendat">Pokedex</h1>
        <h3 class="login-screendat">Accede con email y contraseña</h3>
        <form @submit.prevent="login"  class="login-screendat">
            <div class="form-group">
                <label for="exampleInputEmail1">Correo Electronico</label>
                <input type="email" class="form-control" aria-describedby="emailHelp" v-model="email" placeholder="Escribe tu email">
            </div>
            <br>
            <div class="form-group">
                <label for="exampleInputPassword1">Contraseña</label>
                <input type="password" class="form-control" v-model="password" placeholder="Contraseña">
            </div>
            <br>
            <button type="submit" class="btn btn-primary">Acceder</button>
            </form>
    </div>
</template>