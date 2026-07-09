#![allow(unexpected_cfgs)]

use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg,
    program_error::ProgramError, pubkey::Pubkey,
};

entrypoint!(process_instruction);

const RECEIPT_INSTRUCTION_VERSION: u8 = 1;
const RECEIPT_HASH_LENGTH: usize = 32;
const INSTRUCTION_LENGTH: usize = 1 + RECEIPT_HASH_LENGTH;

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let receipt_hash = parse_receipt_hash(instruction_data)?;

    msg!(
        "BenchArena receipt accepted for anchoring: version={}, prefix={:02x}{:02x}{:02x}{:02x}",
        RECEIPT_INSTRUCTION_VERSION,
        receipt_hash[0],
        receipt_hash[1],
        receipt_hash[2],
        receipt_hash[3]
    );
    Ok(())
}

fn parse_receipt_hash(instruction_data: &[u8]) -> Result<[u8; 32], ProgramError> {
    if instruction_data.len() != INSTRUCTION_LENGTH {
        return Err(ProgramError::InvalidInstructionData);
    }
    if instruction_data[0] != RECEIPT_INSTRUCTION_VERSION {
        return Err(ProgramError::InvalidInstructionData);
    }

    instruction_data[1..]
        .try_into()
        .map_err(|_| ProgramError::InvalidInstructionData)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_a_versioned_receipt_hash() {
        let mut instruction = vec![RECEIPT_INSTRUCTION_VERSION];
        instruction.extend([9; RECEIPT_HASH_LENGTH]);

        assert_eq!(parse_receipt_hash(&instruction).unwrap(), [9; 32]);
    }

    #[test]
    fn rejects_unknown_versions_and_lengths() {
        assert_eq!(
            parse_receipt_hash(&[2; INSTRUCTION_LENGTH]).unwrap_err(),
            ProgramError::InvalidInstructionData
        );
        assert_eq!(
            parse_receipt_hash(&[1; RECEIPT_HASH_LENGTH]).unwrap_err(),
            ProgramError::InvalidInstructionData
        );
    }
}
