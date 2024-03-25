import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const CharacterDetail = () => {
  const { characterId } = useParams();
  const character = useSelector((state) =>
    state.characters.entities.find((char) => char.id.toString() === characterId)
  );

  if (!character) {
    return <div>Character not found</div>;
  }

  return (
    <div>
        <Link to="/characters">Go back</Link>
      <h1>{character.name}</h1>
    </div>
  );
};