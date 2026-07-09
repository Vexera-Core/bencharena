use std::{fs, path::Path};

use serde_json::Value;
use thiserror::Error;

pub fn load_identity_document(path: &Path) -> Result<Value, IdentityLoadError> {
    let content = fs::read_to_string(path)?;
    match path.extension().and_then(|extension| extension.to_str()) {
        Some("json") => Ok(serde_json::from_str(&content)?),
        Some("md") | Some("markdown") => parse_identity_markdown(&content),
        _ => Err(IdentityLoadError::UnsupportedFormat),
    }
}

pub fn parse_identity_markdown(content: &str) -> Result<Value, IdentityLoadError> {
    let mut lines = content.lines();
    if lines.next().map(str::trim) != Some("---") {
        return Err(IdentityLoadError::MissingFrontmatter);
    }

    let mut frontmatter = Vec::new();
    let mut closed = false;
    for line in lines {
        if line.trim() == "---" {
            closed = true;
            break;
        }
        frontmatter.push(line);
    }

    if !closed || frontmatter.is_empty() {
        return Err(IdentityLoadError::MissingFrontmatter);
    }

    Ok(serde_json::from_str(&frontmatter.join("\n"))?)
}

#[derive(Debug, Error)]
pub enum IdentityLoadError {
    #[error("identity file could not be read")]
    Io(#[from] std::io::Error),
    #[error("identity JSON is invalid")]
    InvalidJson(#[from] serde_json::Error),
    #[error("Markdown identity must begin with closed JSON frontmatter")]
    MissingFrontmatter,
    #[error("identity file must use .json, .md, or .markdown")]
    UnsupportedFormat,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_strict_json_frontmatter_from_markdown() {
        let document = parse_identity_markdown(
            r#"---
{
  "name": "Markdown Agent",
  "version": "0.1.0"
}
---

# Human-readable notes
"#,
        )
        .unwrap();

        assert_eq!(document["name"], "Markdown Agent");
    }

    #[test]
    fn rejects_free_form_markdown_without_frontmatter() {
        assert!(matches!(
            parse_identity_markdown("# Agent notes only"),
            Err(IdentityLoadError::MissingFrontmatter)
        ));
    }
}
