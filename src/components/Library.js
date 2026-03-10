import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from './SectionTitle';

const BOOKS = [
  { color: '#8b4557', title: 'Dreams', quote: '"She is too fond of books, and it has turned her brain."', author: '— Louisa May Alcott' },
  { color: '#4a6741', title: 'Wonder', quote: '"And still, after all this time, the Sun never says to the Earth, \'You owe me.\' Look what happens with a love like that. It lights the whole sky."', author: '— Hafiz' },
  { color: '#4a5568', title: 'Magic', quote: '"We are all in the gutter, but some of us are looking at the stars."', author: '— Oscar Wilde' },
  { color: '#6b4c8a', title: 'Stars', quote: '"She was made of sunlight and wildflowers, of fairy tales and dreams that had yet to come true."', author: '— Unknown' },
  { color: '#8b6914', title: 'Love', quote: '"The world is full of magic things, patiently waiting for our senses to grow sharper."', author: '— W.B. Yeats' },
  { color: '#2d5a6b', title: 'Ocean', quote: '"The cure for anything is salt water: sweat, tears, or the sea."', author: '— Isak Dinesen' },
  { color: '#7a4a5a', title: 'Roses', quote: '"She wore her scars as her best attire. A stunning dress made of hellfire."', author: '— Daniel Saint' },
  { color: '#5a6b4a', title: 'Garden', quote: '"And the day came when the risk to remain tight in a bud was more painful than the risk it took to blossom."', author: '— Anaïs Nin' },
  { color: '#8a6b4c', title: 'Journey', quote: '"Not all those who wander are lost."', author: '— J.R.R. Tolkien' },
  { color: '#4a4a7a', title: 'Crown', quote: '"A queen—a queen who bowed to no one, a queen who had risen from nothing."', author: '— Sarah J. Maas' },
  { color: '#6b5a4a', title: 'Pearls', quote: '"She wasn\'t looking for a knight. She was looking for a sword."', author: '— Atticus' },
  { color: '#4a6b6b', title: 'Waves', quote: '"You are the universe, expressing itself as a human for a little while."', author: '— Eckhart Tolle' },
];

function Library({ onCollectGem }) {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <section className="library-section" id="library">
      <SectionTitle
        ornament="📚"
        title="The Enchanted Library"
        subtitle="Pull a book from the shelf and discover a message"
      />

      <div className="book-shelf">
        {BOOKS.map((book, index) => (
          <motion.div
            key={index}
            className="book"
            style={{ background: `linear-gradient(135deg, ${book.color}, ${book.color}dd)` }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ y: -20, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedBook(book)}
          >
            {book.title}
          </motion.div>
        ))}
      </div>

      {/* Hidden gem */}
      <motion.span
        className="hidden-gem"
        style={{ bottom: '15%', left: '12%' }}
        whileHover={{ scale: 1.5 }}
        onClick={(e) => {
          e.currentTarget.classList.add('gem-collected');
          onCollectGem('library-gem');
        }}
      >
        📖
      </motion.span>

      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="book-popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              className="book-popup-content"
              initial={{ scale: 0.5, rotateX: 30 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="book-quote">{selectedBook.quote}</p>
              <p className="book-author">{selectedBook.author}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Library;
