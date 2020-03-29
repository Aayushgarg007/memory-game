import React, { Component } from 'react';
import shuffle from 'shuffle-array';
import Navbar from './Navbar';
import Card from './Card';

const cardState = {
  HIDING: 0,  // card is hiding
  SHOWING: 1, // card is showing but can or cannot match
  MATCHING: 2 // card is matched
}

class App extends Component {
  constructor(props) {
    super(props);
    
    let cards = [
      {id: 0, cardState: cardState.HIDING, backgroundColor: 'red'},
      {id: 1, cardState: cardState.HIDING, backgroundColor: 'red'},
      {id: 2, cardState: cardState.HIDING, backgroundColor: 'navy'},
      {id: 3, cardState: cardState.HIDING, backgroundColor: 'navy'},
      {id: 4, cardState: cardState.HIDING, backgroundColor: 'green'},
      {id: 5, cardState: cardState.HIDING, backgroundColor: 'green'},
      {id: 6, cardState: cardState.HIDING, backgroundColor: 'yellow'},
      {id: 7, cardState: cardState.HIDING, backgroundColor: 'yellow'},
      {id: 8, cardState: cardState.HIDING, backgroundColor: 'black'},
      {id: 9, cardState: cardState.HIDING, backgroundColor: 'black'},
      {id: 10, cardState: cardState.HIDING, backgroundColor: 'purple'},
      {id: 11, cardState: cardState.HIDING, backgroundColor: 'purple'},
      {id: 12, cardState: cardState.HIDING, backgroundColor: 'pink'},
      {id: 13, cardState: cardState.HIDING, backgroundColor: 'pink'},
      {id: 14, cardState: cardState.HIDING, backgroundColor: 'lightskyblue'},
      {id: 15, cardState: cardState.HIDING, backgroundColor: 'lightskyblue'},
    ];
    // shuffle the card 
    cards = shuffle(cards)
    this.state = { cards, noClick: false};
  }
  
  // to handle the case when a box is clicked
  handleClick = (id) => {
    // card that is clicked
    const foundCard = this.state.cards.find(c=> c.id === id);

    // if card is already showing a color then don't do anything
    if(this.state.noClick || foundCard.cardState !== cardState.HIDING) {
      return;
    }
    
    // function to change the card state with the state that is passed
    const mapCardState = (cards, idsToChange, newCardState) => {
      return cards.map(c => {
        if(idsToChange.includes(c.id)){
          return {
            ...c,
            cardState: newCardState
          };
        }
        return c;
      });
    }

    // this will make sure nothing happens when user click on any other card
    // during 2 not matched cards are transitioning to hidden
    let noClick = false;

    // changing the clicked card's state to showing
    let cards = mapCardState(this.state.cards, [id], cardState.SHOWING);

    // cards that are showing
    const showingCards = cards.filter((c) => c.cardState === cardState.SHOWING)

    const ids = showingCards.map(c => c.id);

    if(showingCards.length === 2 && 
       showingCards[0].backgroundColor === showingCards[1].backgroundColor) {
        cards = mapCardState(cards, ids, cardState.MATCHING);
    } else if(showingCards.length === 2) {
        let hidingCards = mapCardState(cards, ids, cardState.HIDING);

        noClick = true;

        this.setState({cards, noClick}, () => {
          setTimeout(() => {
            // set card state to hiding after 1.3 seconds
            this.setState({ cards: hidingCards, noClick: false });
          }, 1300);
        });
        return;
    }

    this.setState({ cards, noClick });
  }

  // to handle the case when the 'new game' button is clicked in the navbar
  handleNewGame = () => {
    let cards = this.state.cards.map(c => (
      {
        ...c,
        cardState: cardState.HIDING
      }
    ));
    cards = shuffle(cards);
    this.setState({cards})
  }

  render() {
    const cards = this.state.cards.map(card => (
      <Card 
        key={card.id} 
        showing={card.cardState !== cardState.HIDING}
        backgroundColor={card.backgroundColor}
        onClick={() => this.handleClick(card.id)}
      />
    ));

    return (
      <div>
        <Navbar onNewGame={this.handleNewGame}/>
        {cards}
      </div>
    );
  }
}

export default App;