import React, { Component } from 'react';
import Card from './Card';
import './Deck.css'
import Axios from 'axios';
const API_BASE_URL = "https://deckofcardsapi.com/api/deck";
// deck: https://deckofcardsapi.com/api/deck/new/shuffle/
// cards: https://deckofcardsapi.com/api/deck/${deck_id}/draw/

class Deck extends Component {
    constructor(props) {
        super(props);
        this.state = { deck: null, drawn: [] }
        this.getCard = this.getCard.bind(this);
    }

    async componentDidMount() { 
        // request a new deck
        let deck = await Axios.get(`${API_BASE_URL}/new/shuffle`)
        // make deck data available in local state
        this.setState({ deck: deck.data })
    }

    async getCard() {
        // store the deck id
        let deck_id = this.state.deck.deck_id;
        // make request for a new card
        try {
            // url 
            let cardUrl = `${API_BASE_URL}/${deck_id}/draw`;
            // promise request
            let cardRes = await Axios.get(cardUrl);
            // check cards left; error otherwise
            console.log(cardRes.data)
            if(!cardRes.data.success)
                throw new Error('Not enough cards remaining to draw 1 additional')
        // update state
            // latest card
            let card = cardRes.data.cards[0];
            // update array of drawn cards
            this.setState( st => ({
                drawn: [
                    ...st.drawn,
                    {
                        id: card.code,
                        image: card.image,
                        name: `${card.value} of ${card.suit}`
                    }
                ]
            }))         
        } catch(error) {
            alert(error)
        }

        
    }

    render() {
        const cards = this.state.drawn.map( c => (
            <Card key={c.id} image={c.image} name={c.name}/>
        ))
        return (
            <div className="Deck">
                <h1 className="Deck-title">◇ Card Dealer ◇</h1>
                <h2 className="Deck-title subtitle">♤ A little demo made with react ♤</h2>
                <button className="Deck-btn" onClick={this.getCard}>Get new card</button>
                <div className="Deck-cardsarea">{cards}</div>
            </div>
        )
    }
}

export default Deck;