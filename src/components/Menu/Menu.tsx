import classNames from 'classnames';
import { ChangeEvent, useState } from 'react';
import { Error } from '../../../types/Error';
import 'bulma/css/bulma.min.css';

type Props = {
  error: Error | null;
  handleCreateRoom: (value: string) => void;
  handleJoinRoom: (value: string) => void;
  handleJoinRandomRoom: () => void;
};

export const Menu: React.FC<Props> = ({
  error,
  handleCreateRoom,
  handleJoinRoom,
  handleJoinRandomRoom,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [createInput, setCreateInput] = useState('');
  const [joinInput, setJoinInput] = useState('');

  const handleSelect = (section: string | null) => {
    setSelected(section);
  };

  const handleCreateInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCreateInput(event.target.value);
  };

  const handleJoinInput = (event: ChangeEvent<HTMLInputElement>) => {
    setJoinInput(event.target.value);
  };

  const handleSubmitCreate = () => {
    if (createInput) {
      handleCreateRoom(createInput.toLowerCase());
      setCreateInput('');
    }
  };

  const handleSubmitJoin = () => {
    if (joinInput) {
      handleJoinRoom(joinInput.toLowerCase());
      setJoinInput('');
    }
  };

  const handleSubmitJoinRandom = () => {
    handleJoinRandomRoom();
    setJoinInput('');
  };

  const mainMenuStyles = {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
  };

  const errorStyles = {
    width: '300px',
    margin: '0 auto',
    marginTop: '40px',
    display: 'block',
    background: '#cc0000',
    color: 'white',
    padding: '10px',
  };

  return (
    <div>
      <h1 className="title is-3">Tic Tac Toe</h1>

      {!selected && (
        <div style={mainMenuStyles}>
          <button
            type="submit"
            className="button is-primary"
            onClick={() => handleSelect('create')}
          >
            Create Room
          </button>
          <button
            type="submit"
            className="button is-primary"
            onClick={() => handleSelect('join')}
          >
            Join Room
          </button>
        </div>
      )}

      {selected === 'create' && (
        <div>
          <input
            type="text"
            placeholder="Enter a name of the room"
            className="input"
            style={{ marginBottom: '30px' }}
            value={createInput}
            onChange={handleCreateInput}
          />
          <div style={mainMenuStyles}>
            <button
              type="submit"
              className="button is-primary"
              onClick={handleSubmitCreate}
            >
              Create
            </button>

            <button
              type="submit"
              className="button is-light"
              onClick={() => handleSelect(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selected === 'join' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <input
            type="text"
            className="input"
            placeholder="Enter a name of the room"
            value={joinInput}
            onChange={handleJoinInput}
          />
          <div style={mainMenuStyles}>
            <button
              type="submit"
              className="button is-primary"
              onClick={handleSubmitJoin}
            >
              Join
            </button>

            <button
              type="submit"
              className="button is-light"
              onClick={() => handleSelect(null)}
            >
              Cancel
            </button>
          </div>

          <button
            type="submit"
            className="button is-primary"
            onClick={handleSubmitJoinRandom}
          >
            Join Random
          </button>
        </div>
      )}

      <p
        className={classNames('error', { 'is-hidden': !error })}
        style={errorStyles}
      >
        {error}
      </p>
    </div>
  );
};
